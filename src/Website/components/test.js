{thumbnails.length === 0 ? (
      <Box
        sx={{
          flexGrow: 1,
          justifyContent: "center",
          alignSelf: "center",
        }}
      >
        <Typography
          variant="body1"
          color="error"
          className="video_home_card_hending_Not_found"
        >
          Video Not Found
        </Typography>
      </Box>
    ) : (
      thumbnails.map((thumbnail) => {
        const avatarComponentDestop = createAvatarJoy(
          thumbnail.user_id.pic,
          thumbnail.user_id.first_name,
          thumbnail.user_id.last_name,
          "headerdesktop"
        );
        return (
          <span
            style={{ textDecoration: "none", color: "inherit", cursor: "pointer" }}
            onClick={(event) => {
              CheckAuth("Timeline_List");
            }}
            key={thumbnail._id}
          >
            <JoyCard
              variant="soft"
              key={thumbnail._id}
              sx={{
                minHeight: "200px",
                flexGrow: 1,
              }}
              className="letest_home_card_thumbnail"
            >
              <JoyCardContent>
                <JoyBox sx={{ display: "flex", alignItems: "center" }}>
                  <div
                    onClick={() => {
                      ProfileUrl(thumbnail.user_id._id);
                    }}
                    style={{ cursor: "pointer" }}
                  >
                    {avatarComponentDestop}
                  </div>
                  <JoyBox sx={{}}>
                    <div
                      onClick={() => {
                        ProfileUrl(thumbnail.user_id._id);
                      }}
                      style={{ cursor: "pointer" }}
                    >
                      <JoyTypography
                        sx={{ marginLeft: "8px" }}
                        level="title-md"
                        className="letest_home_card_thumbnail_user_name"
                      >
                        {`${thumbnail.user_id.first_name}`}
                      </JoyTypography>
                    </div>
                    <JoyTypography
                      sx={{ marginLeft: "8px" }}
                      level="title-md"
                      className="letest_home_card_thumbnail_category_name"
                    >
                      {thumbnail.category_id.category_name}
                    </JoyTypography>
                  </JoyBox>
                </JoyBox>
                <JoyTypography className="letest_home_card_thumbnail_title">
                  {thumbnail.title.length > 20
                    ? `${thumbnail.title.slice(0, 20)}...`
                    : thumbnail.title}
                </JoyTypography>
                <JoyTypography className="letest_home_card_thumbnail_desc">
                  {thumbnail.description.length > 120
                    ? `${thumbnail.description.slice(0, 120)}...`
                    : thumbnail.description}
                </JoyTypography>
              </JoyCardContent>
            </JoyCard>
          </span>
        );
        ))
        )}
